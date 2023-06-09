import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import CredentialsProvider from "next-auth/providers/credentials";
import {redirect} from "next/navigation";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
      // 这里的user是有值的，
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt user",JSON.stringify(user));
      if (user) {
        token.id = user.id;
        token.tel = user.tel;
      }
      return token;
    },
    // 这里的user是空的，token是有值的
    async session({ session, user, token }) {
      if(session && token){
          session.user.id = token.id;
          session.user.tel = token.tel;
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
    providers: [
      CredentialsProvider({
        // 登录按钮显示 (e.g. "Sign in with Credentials")
        name: "Credentials",
        // credentials 用于配置登录页面的表单
        credentials: {
          tel: {
            label: "手机号",
            type: "text",
            placeholder: "请输入手机号",
          },
          password: {
            label: "密码",
            type: "password",
            placeholder: "请输入密码",
          },
        },
        async authorize(credentials, req) {
          console.log("credentials",JSON.stringify(credentials));
          // TODO
          const users= await prisma.user.findMany({
            where: {
                tel: credentials.tel,
                password: credentials.password,
            }
          });
          console.log("users",JSON.stringify(users));
          if (users) {
            // 返回的对象将保存才JWT 的用户属性中
            return users[0];
          } else {
            // 如果返回null，则会显示一个错误，建议用户检查其详细信息。
            return null;
            // 跳转到错误页面，并且携带错误信息 http://localhost:3000/api/auth/error?error=用户名或密码错误
         //   throw new Error("用户名或密码错误");
          }
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    jwt: {
      secret: process.env.SECRET,
    },
    secret: process.env.SECRET,
};

export default NextAuth({
  ...authOptions,
});
