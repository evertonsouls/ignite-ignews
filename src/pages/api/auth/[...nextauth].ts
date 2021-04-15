import { query as q } from 'faunadb'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user',
    }), 
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,    
  },
  callbacks: {
    async signIn(user, account, profile) {
      
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),

            q.Create(
              q.Collection('users'),
              {
                data: { email },
              },
            ),
            
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        );
        
        return true;        
      } catch {
        return false;
      }
    },    
  }, 
})