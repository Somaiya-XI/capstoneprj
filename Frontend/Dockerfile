FROM node:20-alpine

WORKDIR /usr/src/app/frontend

COPY ./package.json /usr/src/app/frontend/

COPY . /usr/src/app/frontend/

RUN npm install

RUN npm install -g vite

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]