export interface LoginRequestData {
  /** admin 或 editor */
  email: string
  /** 密码 */
  password: string
  /** 验证码 */
  // code: string
}

export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ username: string, roles: string[] }>
