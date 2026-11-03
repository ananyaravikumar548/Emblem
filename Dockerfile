FROM node:20-alpine AS frontend-build
WORKDIR /workspace

COPY frontend/package*.json ./frontend/
RUN npm --prefix frontend ci
COPY frontend ./frontend
ARG REACT_APP_API_URL=/api/v1
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm --prefix frontend run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

COPY backend/package*.json ./backend/
RUN npm --prefix backend ci --omit=dev && npm cache clean --force
COPY backend ./backend
COPY --from=frontend-build /workspace/frontend/build ./frontend/build

EXPOSE 8080
CMD ["node", "backend/server.js"]
