import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(`Request took too long! Timeout after ${s} second`);
    }, s * 1000);
  });
};

export const AJAX = async function (url) {
  try {
    const fetchPro = fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    if (!response.ok) {
      throw new Error(`Something went wrong. Status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
