import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { registerSchema } from './schema';

export const load = async ({ url }) => {
  const token = url.searchParams.get('t');
  const form = await superValidate(token ? { token } : undefined, zod4(registerSchema), { errors: false });
  return { form };
};

const SERVER_ERROR_MESSAGE = 'An internal server error occurred. Try again later.';

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(registerSchema));

    if (!form.valid) {
      return fail(StatusCodes.BAD_REQUEST, { form });
    }

    if (dev) {
      return message(form, 'Registered successfully.');
    }

    try {
      const response = await fetch(`${env.PROSODY_HOST}/register_api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.data.JID,
          password: form.data.password,
          token: form.data.token,
        }),
      });

      if (response.ok) {
        return message(form, 'Registered successfully.');
      }

      if (response.status === StatusCodes.NOT_FOUND) {
        return message(form, 'The provided token is not valid or expired. Try again.', {
          status: StatusCodes.BAD_REQUEST,
        });
      } else if (response.status === StatusCodes.CONFLICT) {
        return message(form, 'The provided JID is already registered. Try again.', { status: StatusCodes.BAD_REQUEST });
      } else if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        return message(form, 'An internal server error occurred. Try again later.', {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }

      return message(form, SERVER_ERROR_MESSAGE, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    } catch {
      return message(form, SERVER_ERROR_MESSAGE, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  },
};
