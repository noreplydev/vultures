import dynamic from 'next/dynamic'

export const UseAnimations = dynamic(() => import('react-useanimations'), {
  loading: () => <p>Loading...</p>,
});

import _Loading from 'react-useanimations/lib/loading'


export const Loading = _Loading