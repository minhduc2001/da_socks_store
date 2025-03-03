import { fetcher } from './Fetcher';

function initPayment(data: any) {
  return fetcher({ url: 'bill/init', method: 'post', data });
}

export default { initPayment };
