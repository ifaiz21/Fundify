"use client"

const FeedbackDetailsModal = ({ feedback, onClose }) => {
  // Mock data to supplement the feedback data
  const { userId, name, type, email, remarks, date, time } = feedback || {};

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Feedback Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User ID and Date/Time */}
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
            <div>
              <p className="text-sm font-medium mb-1">User ID</p>
              <p className="text-sm">{userId}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Date / Time</p>
              <p className="text-sm">{date} / {time}</p>
            </div>
          </div>

          {/* Name and Type */}
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
            <div>
              <p className="text-sm font-medium mb-1">Name</p>
              <div className="flex justify-between items-center">
              <p className="text-sm">{name}</p>
                {/*<div className="h-4 w-4 border border-gray-300 rounded"></div>*/}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Type</p>
              <div className="flex justify-between items-center">
                <p className="text-sm">{type}</p> 
               {/*} <div className="h-4 w-4 border border-gray-300 rounded"></div> */}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4 pb-4 border-b">
            <p className="text-sm font-medium mb-1">Email</p>
            <p className="text-sm">{email}</p>
          </div>

          {/* Remarks */}
          <div>
            <p className="text-sm font-medium mb-1">Remarks</p>
            <p className="text-sm">{remarks}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackDetailsModal;
