import React from 'react';
import { TooltipHost, DefaultButton } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useId } from '@fluentui/react-hooks';

const DeleteButtonWithTooltip = () => {
  // Generate a unique id for the tooltip
  const tooltipId = useId('tooltip');
  const buttonId = useId('button');
  const calloutProps = { gapSpace: 0 };

  return (
    <TooltipHost content="DELETE" id={tooltipId} calloutProps={calloutProps}>
      
        <FontAwesomeIcon icon={faTrashAlt}  style={{width:"30px"}}/>
      
    </TooltipHost>
  );
};

const MyComponent = () => {
  return (
    <div>
      <DeleteButtonWithTooltip />
     
    </div>
  );
};

export default MyComponent;
