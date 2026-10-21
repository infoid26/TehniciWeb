FROM node:24-bookworm-slim
WORKDIR /app
# Separate dependencies: no website, course, Azure adapter or deployment secrets.
COPY evaluator/package.json ./package.json
RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force
COPY scripts/lab-worker.mjs scripts/inject.mjs ./scripts/
COPY evaluator/server.mjs evaluator/run.mjs ./evaluator/
ENV NODE_ENV=production
USER node
CMD ["/bin/sleep", "infinity"]
