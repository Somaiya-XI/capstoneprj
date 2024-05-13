FROM python:3.11-alpine3.19

WORKDIR /usr/src/app/backend

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONBUFFERED=1

RUN pip install --upgrade pip

COPY ./requirements.txt /usr/src/app/backend/requirements.txt

RUN pip install -r requirements.txt

COPY ./entry.sh /usr/src/app/backend/entry.sh

COPY . /usr/src/app/backend

EXPOSE 8000

ENTRYPOINT [ "/usr/src/app/backend/entry.sh" ]