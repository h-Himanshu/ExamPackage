import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default function DownloadPdfButton({ onClick, title = 'Download PDF' }) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onClick}
      title={title}
      style={{ marginLeft: '8px' }}
    >
      <FontAwesomeIcon icon={faDownload} />
    </button>
  );
}
