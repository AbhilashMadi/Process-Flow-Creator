
export const generateNodeId = (): string => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTransitionId = (): string => {
  return `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateWorkflowId = (): string => {
  return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};