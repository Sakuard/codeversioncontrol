// @ts-check
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export const $axios = axios.create({
  baseURL: process.env.CVS_BASEURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  withCredentials: true,
})