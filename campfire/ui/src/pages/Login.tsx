import Urbit from '@urbit/http-api';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router';
import {useStore} from '../stores/root';

interface UrbitAuth {
  ship: string;
  url: string;
  code: string;
}

// eslint-disable-next-line
function Login() {
  console.log("loading login page");
  const { urchatStore } = useStore();
  const [urbitErr, setUrbitErr] = useState('');
  const [awaitingUrbit, setAwaitingUrbit] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      ship: 'zod',
      url: 'localhost:8080',
      code: 'lidlut-tabwed-pillex-ridrup'
    }
  });
  const [errTimeout, setErrTimeout] = useState<NodeJS.Timeout | null>(null);

  const authenticate = (data: UrbitAuth) => {
    setAwaitingUrbit(true);
    console.log("attempting to auth")
    Urbit.authenticate({ ...data, 'verbose': true })
      .then((ur) => {
        urchatStore.setUrbit(ur);
        setAwaitingUrbit(false);
      })
      .catch((err) => {
        setUrbitErr(err.toString());
        setAwaitingUrbit(false);
        if( errTimeout !== null ) {
          clearTimeout(errTimeout);
          setErrTimeout(null);
        }
        setErrTimeout(setTimeout(() => {
          setUrbitErr('');
          setErrTimeout(null);
        }, 5000));
      });
  };

  if (urchatStore.urbit || import.meta.env.DEV) {
    return <Redirect to="/chat" />
  }

  return (
    <section className="flex justify-center items-center w-full h-full p-4 sm:p-8">
      <div>
        <form className="flex flex-col w-full max-w-xs space-y-4" onSubmit={handleSubmit(authenticate)}>
          <div>
            <label htmlFor="ship" className="px-4 font-semibold">Ship</label>
            <input 
              id="ship" 
              type="text" 
              className="input"
              defaultValue="zod"
              {...register('ship')}
              disabled={awaitingUrbit} 
            />
          </div>
          <div>
            <label htmlFor="url" className="px-4 font-semibold">URL</label>
            <input 
              id="url" 
              type="text" 
              className="input"
              defaultValue="localhost:8080"
              {...register('url')}
              disabled={awaitingUrbit} 
            />
          </div>
          <div>
            <label htmlFor="code" className="px-4 font-semibold">Code</label>
            <input 
              id="code" 
              type="password" 
              className="input"
              defaultValue="lidlut-tabwed-pillex-ridrup"
              {...register('code')}
              disabled={awaitingUrbit} 
            />
          </div>
          <button type="submit" className="button bg-red-600 text-white" disabled={awaitingUrbit}>Connect</button>
        </form>
        <div className="Urbit-err">
          {urbitErr}
        </div>
        {/*<div className="Urbit-embedded-app">
          {urbit === null ? '' : (
          <After urbit={urbit} />
          )}
          </div>*/}
      </div>
    </section>
  );
}

export default Login;
