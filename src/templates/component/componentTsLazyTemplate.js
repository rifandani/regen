export default `
import React, { lazy, Suspense } from 'react';

const LazyTemplateName = lazy(() => import('./TemplateName'));

function TemplateName(props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) {
  return (
    <Suspense fallback={null}>
      <LazyTemplateName {...props} />
    </Suspense>
  );
};

export default TemplateName;
`;
