import React, { useEffect } from 'react'; 
import { CheckCircle2, Clock, XCircle } from 'lucide-react'; 
import { useAuthStore } from '../store/useAuthStore';  

const EmployeeDashboard = () => {   
  const {      
    assignments,      
    fetchEmployeeAssignments,      
    authUser,      
    isFetchingAssignments,
    updateAssignmentStatus
  } = useAuthStore();    

  useEffect(() => {     
    if (authUser?._id) {       
      fetchEmployeeAssignments(authUser._id);     
    }   
  }, [authUser]);    

  const getStatusStyles = (status) => {     
    const styles = {       
      'pending': 'text-yellow-500',       
      'in-progress': 'text-blue-500',       
      'completed': 'text-green-500',       
      'rejected': 'text-red-500'     
    };     
    return styles[status] || 'text-gray-500';   
  };    

  const StatusIcon = ({ status }) => {     
    const icons = {       
      'pending': <Clock />,       
      'in-progress': <Clock />,       
      'completed': <CheckCircle2 />,       
      'rejected': <XCircle />     
    };     
    return icons[status] || null;   
  };    

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await updateAssignmentStatus(taskId, newStatus);
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (isFetchingAssignments) {     
    return <div className="text-center p-6">Loading assignments...</div>;   
  }    

  return (     
    <div className="p-6 bg-base-100">       
      <h2 className="text-2xl font-bold mb-6">My Assignments</h2>              
      {assignments.length === 0 ? (         
        <div className="text-center text-gray-500">No assignments found</div>       
      ) : (         
        <div className="grid md:grid-cols-2 gap-4">           
          {assignments.map(task => (             
            <div                
              key={task._id}               
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"             
            >               
              <div className="flex justify-between items-center mb-4">                 
                <h3 className="text-xl font-semibold">{task.title}</h3>                 
                <span className={`flex items-center gap-2 ${getStatusStyles(task.status)}`}>                   
                  <StatusIcon status={task.status} />                   
                  {task.status.replace('-', ' ')}                 
                </span>               
              </div>                
              <p className="text-base-content/70 mb-2">                 
                Description: {task.description}               
              </p>                
              <div className="flex justify-between items-center mt-4">                 
                <span className="text-sm text-base-content/60">                   
                  Deadline: {new Date(task.deadline).toLocaleDateString()}                 
                </span>
                
                {task.status !== 'completed' && (
                  <div className="flex gap-2">
                    {task.status !== 'in-progress' && (
                      <button
                        className="btn btn-xs btn-outline btn-primary"
                        onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                      >
                        Start Work
                      </button>
                    )}
                    <button
                      className="btn btn-xs btn-outline btn-success"
                      onClick={() => handleStatusUpdate(task._id, 'completed')}
                    >
                      Mark Complete
                    </button>
                  </div>
                )}
              </div>             
            </div>           
          ))}         
        </div>       
      )}     
    </div>   
  ); 
};  

export default EmployeeDashboard;