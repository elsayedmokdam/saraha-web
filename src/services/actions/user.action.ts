"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { ApiResponse, Paginated, PaginationParams } from "../types/api_interface";
import {
  AdminAddUserPayload,
  AdminUpdateUserPayload,
  UpdatePasswordPayload,
  UpdateUserDataPayload,
  User,
} from "../types/user_interface";
import { validateImageFile } from "../utils/helpers/files";
import { HttpResult } from "../utils/http";

export async function getProfileAction(): Promise<HttpResult<ApiResponse<User>>> {
  return $SERVICE_REPOSITORY.Users.getProfile();
}

/** `formData` must contain the image under the key `attachment`. */
export async function uploadProfileImageAction(
  formData: FormData,
): Promise<HttpResult<ApiResponse<User>>> {
  const file = formData.get("attachment");

  if (!file || typeof file === "string" || file.size === 0) {
    return { ok: false, error: { message: "Please choose an image", status: 400 } };
  }

  const problem = validateImageFile(file, 10);
  if (problem) return { ok: false, error: { message: problem, status: 400 } };

  return $SERVICE_REPOSITORY.Users.uploadProfileImage(file);
}

/** Admin only */
export async function getAllUsersAction(
  params: PaginationParams = {},
): Promise<
  HttpResult<ApiResponse<Paginated<User>>>
> {
  return $SERVICE_REPOSITORY.Users.getAllUsers(params);
}

/** Admin only */
export async function addUserAction(
  payload: AdminAddUserPayload,
): Promise<HttpResult<ApiResponse<unknown>>> {
  return $SERVICE_REPOSITORY.Users.addUser(payload);
}

/** Admin only */
export async function updateUserAction(
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<HttpResult<ApiResponse<unknown>>> {
  return $SERVICE_REPOSITORY.Users.updateUser(userId, payload);
}

/** Admin only */
export async function deleteUserAction(
  userId: string,
): Promise<HttpResult<ApiResponse<unknown>>> {
  return $SERVICE_REPOSITORY.Users.deleteUser(userId);
}

/** PUT /user/update-data */
export async function updateUserDataAction(
  payload: UpdateUserDataPayload,
): Promise<HttpResult<ApiResponse<User>>> {
  return $SERVICE_REPOSITORY.Users.updateUserData(payload);
}

/** PATCH /user/update-password */
export async function updatePasswordAction(
  payload: UpdatePasswordPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Users.updatePassword(payload);
}
