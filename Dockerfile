FROM node:20.16.0

WORKDIR /E-commerce

COPY . /E-commerce

RUN npm install 

EXPOSE 3000

CMD [ "npm", "start"]
