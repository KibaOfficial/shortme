// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
  Cookies.set(name, value, options);
};

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
