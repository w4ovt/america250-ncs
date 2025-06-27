export default function Head() {
  return (
    <>
      <title>America250-NCS Activations</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="refresh" content="60" />
      <style>{`
        body { 
          font-family: Arial, Helvetica, sans-serif; 
          font-size: 12px; 
          margin: 0; 
          padding: 0; 
          background: white;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 10px; 
          background: white;
        }
        th, td { 
          padding: 3px 5px; 
          border-bottom: 1px solid #eee; 
          text-align: left;
        }
        th { 
          background: #4a4a4a; 
          color: #fff; 
          font-size: 9px; 
          font-weight: bold;
        }
        tr:last-child td { 
          border-bottom: none; 
        }
        .status-active {
          color: #28a745; 
          font-weight: bold; 
          font-size: 9px;
        }
        .volunteer-name {
          font-size: 8px; 
          color: #666;
        }
        .footer {
          text-align: center; 
          color: #999; 
          font-size: 8px; 
          margin-top: 3px;
          border-top: 1px solid #eee;
          padding-top: 3px;
        }
      `}</style>
    </>
  );
} 