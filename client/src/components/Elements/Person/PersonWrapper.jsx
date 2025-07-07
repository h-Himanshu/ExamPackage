import { useParams, useNavigate } from "react-router-dom";
import Person from "./person";

const PersonWrapper = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  
  return <Person {...props} params={params} navigate={navigate} />;
};

export default PersonWrapper;
