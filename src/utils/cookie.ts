import { CookieOptions, Response } from "express";
import { config } from "../config/config";
import { Duration, parseDuration } from "@alwatr/parse-duration";
const setCookieOption = () => {
  const isProd = config.NODE_ENV === "production";
  const domain = config.COOKIE_DOMAIN;
  return <CookieOptions>{
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "lax",
    domain: domain,
    path: "/",
  };
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const AccessExp = parseDuration(config.ACCESS_TOKEN_EXPIRES_IN as Duration);
  const RefreshExp = parseDuration(config.REFRESH_TOKEN_EXPIRES_IN as Duration);
  const options = setCookieOption();
  res.cookie("accessToken", accessToken, { ...options, maxAge: AccessExp });
  res.cookie("refreshToken", refreshToken, { ...options, maxAge: RefreshExp });
};

export const clearAuthCookies = (res: Response) => {
  const options = setCookieOption();
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
};
