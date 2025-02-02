FROM python:3.11.10-slim

WORKDIR /app

ADD . /app

RUN pip install fastapi[standard] scikit-learn==1.5.1 pandas==2.2.2 numpy==1.26.4 joblib==1.4.2 --trusted-host pypi.python.org

EXPOSE 8000

CMD ["fastapi", "run"]