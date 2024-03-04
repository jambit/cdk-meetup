FROM public.ecr.aws/lambda/python:3.11

# Install poetry
RUN pip3 install poetry

# Copy only requirements to cache them in docker layer
COPY poetry.lock pyproject.toml ${LAMBDA_TASK_ROOT}/

# Install the function's dependencies using poetry.lock from your project folder.
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi --no-root

# Copy our app to the Docker image
COPY src/main.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD ["main.lambda_handler"]