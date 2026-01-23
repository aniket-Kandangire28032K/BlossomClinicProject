import {Pie} from 'react-chartjs-2';
import {Chart,ArcElement,Tooltip,Legend} from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({chartdata}:any ) => {
    const data:any = {
        labels:Object.keys(chartdata),
        datasets:[{data:Object.values(chartdata),
        backgroundColor:[
            "#ff6384",
             "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9C27B0",
        ]    
        }],
    }
  return (
    <div className='pie-chart'>
    <Pie data={data}/>
        
    </div>
  )
}

export default PieChart