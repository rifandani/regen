export default `
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function useTemplateNameLogic({ path }) {
  const navigate = useNavigate();

  const onLogout = useCallback(() => {
    navigate(path);
  }, [navigate]);

  return { onLogout };
}

function useTemplateNameViewModel() {
  const templateNameLogic = useTemplateNameLogic({ path: '/login' });

  return { templateNameLogic };
}

export default useTemplateNameViewModel;
`;
