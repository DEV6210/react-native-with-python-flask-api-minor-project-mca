import io from 'socket.io-client';
import { API_URL } from '@env';

export const socketConnection = io(API_URL)