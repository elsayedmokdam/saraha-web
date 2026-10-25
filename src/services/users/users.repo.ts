import { getProfileService } from "./getProfile.service";
import { uploadProfileImageService } from "./uploadProfileImage.service";
import { getAllUsersService } from "./getAllUsers.service";
import { rotateTokenService } from "./rotateToken.service";
import { updateUserDataService } from "./updateUserData.service";
import { updatePasswordService } from "./updatePassword.service";
import { addUserService } from "./addUser.service";
import { updateUserService } from "./updateUser.service";
import { deleteUserService } from "./deleteUser.service";

export const UsersRepo = {
  getProfile: getProfileService,
  uploadProfileImage: uploadProfileImageService,
  getAllUsers: getAllUsersService,
  rotateToken: rotateTokenService,
  updateUserData: updateUserDataService,
  updatePassword: updatePasswordService,
  addUser: addUserService,
  updateUser: updateUserService,
  deleteUser: deleteUserService,
};
