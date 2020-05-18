#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM mhart/alpine-node:12 as Base

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY yarn.lock ./

RUN yarn
COPY . .
RUN yarn build
#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM mhart/alpine-node:12

WORKDIR /app

COPY --from=Base /app .

CMD [ "yarn", "start" ]

