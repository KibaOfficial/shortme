# Copyright (c) 2024 KibaOfficial
# 
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT

openssl genrsa -out key.pem 2048
openssl rsa -in key.pem -outform PEM -pubout -out public.pem