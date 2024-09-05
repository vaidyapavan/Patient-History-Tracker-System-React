import React from 'react';
import { TooltipHost } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useId } from '@fluentui/react-hooks';

const EditButtonWithTooltip = () => {
  const tooltipId = useId('edit-tooltip');
  const calloutProps = { gapSpace: 0 };

  return (
    <TooltipHost content="EDIT" id={tooltipId} calloutProps={calloutProps}>
      <FontAwesomeIcon
        icon={faEdit}
        style={{
          width: '20px', // Adjust icon width as needed
          height: '20px', // Adjust icon height as needed
          cursor: 'pointer', // Indicate it's clickable if needed
        }}
      />
    </TooltipHost>
  );
};

export default EditButtonWithTooltip;
