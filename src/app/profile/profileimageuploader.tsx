import { useState, ChangeEvent } from "react";
import styled from "styled-components";
import Image from "next/image";

const DEFAULT_PROFILE_IMAGE = "https://png.pngitem.com/pimgs/s/508-5087146_circle-hd-png-download.png";

const ProfileImageUploader: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
    }
  };

  return (
    <UploaderContainer>
      <ImagePreview>
        <Image
          src={profileImage ? URL.createObjectURL(profileImage) : DEFAULT_PROFILE_IMAGE}
          alt="Profile"
          width={160}
          height={160}
          style={{ objectFit: "cover" }}
        />
      </ImagePreview>
      <FileUploadForm>
        <FileUploadLabel htmlFor="file-upload">
          <div className="file-upload-design">
            <svg viewBox="0 0 640 512" height="1em">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
            </svg>
            <p>Drag and Drop</p>
            <p>or</p>
            <span className="browse-button">Browse file</span>
          </div>
          <input
            id="file-upload"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            aria-label="Upload profile image"
          />
        </FileUploadLabel>
      </FileUploadForm>
    </UploaderContainer>
  );
};

const UploaderContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 20px;
`;

const ImagePreview = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 100px;
  margin: 0 auto;
  background-color: #31377a;
  overflow: hidden;
  margin-bottom: 14px;
`;

const FileUploadForm = styled.form`
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const FileUploadLabel = styled.label`
  cursor: pointer;
  background-color: #31377a;
  padding: 10px 80px;
  border-radius: 40px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 200px -50px rgba(0, 0, 0, 0.719);
  border-color: #dedede;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  input {
    display: none;
  }

  .file-upload-design {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 5px;
  }

  svg {
    height: 40px;
    fill: rgba(255, 255, 255, 0.7);
    margin-bottom: 10px;
  }

  .browse-button {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 5px 15px;
    border-radius: 10px;
    color: white;
    transition: all 0.3s;
  }

  .browse-button:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

export default ProfileImageUploader;
