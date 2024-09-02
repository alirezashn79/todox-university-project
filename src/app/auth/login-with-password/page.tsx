import Form from "@/components/template/auth/login-with-password/Form";
import React from "react";

export default function LoginWithPassword() {
  return (
    <div className="hero  min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center bg-base-200 p-10 lg:text-left">
          <h1 className="text-5xl leading-[4rem] font-bold">
            Welcome to
            <span className="inline-block text-primary animate-bounce mx-2">
              Todox
            </span>
          </h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border">
          <Form />
        </div>
      </div>
    </div>
  );
}
