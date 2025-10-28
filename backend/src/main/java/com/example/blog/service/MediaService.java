package com.example.blog.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.blog.Enum.ErrorCode;
import com.example.blog.entity.Media;
import com.example.blog.exceptionHanding.exception.AppException;
import com.example.blog.repository.MediaRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;

    @Value("${app.file.upload-dir:uploads}")
    protected String uploadDir;

    @Value("${app.file.base-url:http://localhost:8080/uploads/}")
    protected String baseUrl;

    private Path rootLocation;

    // Tạo thư mục khi container start
    @PostConstruct
    public void init() {
        try {
            rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(rootLocation);
            // Tạo các thư mục con
            String[] subDirs = {"images", "videos", "others"};
            for (String dir : subDirs) {
                Path subDirPath = rootLocation.resolve(dir);
                Files.createDirectories(subDirPath);
                log.info("Directory created: {}", subDirPath);
            }
        } catch (IOException e) {
            log.error("Could not initialize storage directories", e);
            throw new RuntimeException("Could not initialize storage directories", e);
        }
    }

    public List<String> uploadFile(MultipartFile[] files) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        List<Media> mediaList = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();
            Path targetDir;

            if (contentType != null && contentType.startsWith("image/")) {
                targetDir = rootLocation.resolve("images");
            } else if (contentType != null && contentType.startsWith("video/")) {
                targetDir = rootLocation.resolve("videos");
            } else {
                targetDir = rootLocation.resolve("others");
            }

            // Đảm bảo thư mục tồn tại
            Files.createDirectories(targetDir);

            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            }

            String uuidName = UUID.randomUUID().toString();
            String newFileName = extension.isEmpty() ? uuidName : uuidName + "." + extension;

            Path destinationFile = targetDir.resolve(newFileName);
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = rootLocation.relativize(destinationFile).toString().replace("\\", "/");
            String fileUrl = baseUrl.endsWith("/") ? baseUrl + relativePath : baseUrl + "/" + relativePath;

            fileUrls.add(fileUrl);
            log.info("Uploaded file: {}", fileUrl);

            mediaList.add(Media.builder()
                    .id(uuidName)
                    .name(originalFilename != null ? originalFilename : newFileName)
                    .url(fileUrl)
                    .type(extension)
                    .size(file.getSize())
                    .build());
        }

        if (!mediaList.isEmpty()) {
            mediaRepository.saveAll(mediaList);
        }

        return fileUrls;
    }

    public boolean deleteFileByUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) return false;

        Media media = mediaRepository.findByUrl(fileUrl).orElse(null);
        if (media == null) {
            log.warn("File not found in DB: {}", fileUrl);
            return false;
        }

        try {
            URI uri = new URI(fileUrl);
            String relativePath = uri.getPath().replaceFirst("/uploads/", "");
            Path filePath = rootLocation.resolve(relativePath).normalize();

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Deleted file: {}", filePath);
            } else {
                log.warn("File not found on disk: {}", filePath);
                throw new AppException(ErrorCode.FILE_NOT_FOUND);
            }

            mediaRepository.delete(media);
            log.info("Deleted media record from DB: {}", fileUrl);

            return true;
        } catch (IOException e) {
            log.error("Error deleting file: {}", fileUrl, e);
            return false;
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }
}
