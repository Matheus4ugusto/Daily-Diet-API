import { FastifyReply, FastifyRequest } from "fastify"

export async function checkAuthorizationTokenExists(request: FastifyRequest, reply: FastifyReply) {

    const sessionId = request.cookies.authorizationToken

    if(!sessionId){
        return reply.status(401).send({
            error: 'Unauthorized'
        })
    }

}