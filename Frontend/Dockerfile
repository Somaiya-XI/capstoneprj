FROM node:22-alpine

WORKDIR /usr/src/app/frontend

COPY ./package.json /usr/src/app/frontend/

RUN npm install

RUN npm install vite --save-dev

EXPOSE 5173

COPY . /usr/src/app/frontend/

CMD ["npm", "run", "dev", "--", "--host"]