export default `
import React, { lazy, Suspense } from 'react';

const LazyTemplateName = lazy(() => import('./TemplateName'));

function TemplateName(props) {
  return (
    <Suspense fallback={<p>TemplateName loading...</p>}>
      <LazyTemplateName {...props} />
    </Suspense>
  );
};

export default TemplateName;
`;
