import { IRequestOptions } from './../interfaces'

function handleError(response: any) {
  if (!response.ok) {
    const err = response.statusText || response
    
    throw new Error(err);
  }
  
  return response.json();
}

export const makeGetRequest = async (
  url: string,
  opt: IRequestOptions = {}
) => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    ...opt
  }).then(handleError)
}
