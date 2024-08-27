// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Cookies from 'js-cookie';

/**
 * Sets a cookie with the given name, value and options
 * @param name - Cookie name
 * @param value - Value of the cookie
 * @param options - Optional options for the cookie
*/
export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
  Cookies.set(name, value, options);
};

/**
 * Returns the value of a cookie based on it's name
 * @param name - The name of the cookie to get
 * @returns The value of the cookie or undefined if not found
 */
export const getCookie = (name: string) => {
  return Cookies.get(name);
};

/**
 * Removes a cookie based on it's name
 * @param name - Name of the cookie to remove
*/
export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
