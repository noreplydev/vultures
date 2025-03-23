import dynamic from 'next/dynamic'

export const UseAnimations = dynamic(() => import('react-useanimations'), {
  loading: () => <p>Loading...</p>,
});

import _Loading from 'react-useanimations/lib/loading'
import _Trash from 'react-useanimations/lib/trash'


export const Loading = _Loading
export const Trash = _Trash