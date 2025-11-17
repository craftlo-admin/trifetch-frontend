# Trifetch Frontend - ECG Patient Dashboard

A React-based web application for viewing and analyzing patient ECG (Electrocardiogram) data with real-time visualization and ML-powered event prediction.

## 🚀 Features

### Dashboard
- **Patient Queue Management**: View all pending ECG events in a paginated table
- **ML Predictions**: Display predicted cardiac events (AFIB, PAUSE, VTACH, etc.)
- **Rejection Status**: Color-coded events based on validation status
  - 🔵 Blue: Accepted predictions
  - ⚫ Black: Rejected predictions
- **Pagination**: Adjustable rows per page (10/25/50)
- **Interactive Navigation**: Click patient names to view detailed ECG data

### Patient Detail View
- **Dual-Lead ECG Charts**: Simultaneous display of Lead I and Lead II
- **Medical-Grade Visualization**: 
  - Standard ECG paper grid (pink background)
  - 25mm/sec horizontal time scale
  - 10mm/mV vertical amplitude scale
  - 1mm and 5mm grid lines
- **Interactive Timeline**: 
  - 6-second visible window
  - Scrollable mini-chart preview
  - Drag-and-drop navigation
- **Patient Metadata**:
  - Patient ID
  - Event timestamp
  - Predicted category
  - Event start time (in seconds)
  - Rejection status badge

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running on `https://trifetch-backend.onrender.com`

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/craftlo-admin/trifetch-frontend.git
   cd trifetch-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "recharts": "^2.15.0",
  "react-scripts": "5.0.1"
}
```

## 🏗️ Project Structure

```
Frontend/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── App.js              # Main router configuration
│   ├── App.css             # Global styles
│   ├── Dashboard.js        # Patient queue table view
│   ├── PatientDetail.js    # Individual patient ECG view
│   ├── ECGChart.js         # Reusable ECG chart component
│   ├── ECGChart.css        # ECG-specific styling
│   ├── index.js            # React entry point
│   └── index.css           # Root styles
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Dashboard Endpoint
```
GET https://trifetch-backend.onrender.com/api/fetchdata?limit={limit}&offset={offset}
```

**Response:**
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "patient_name": "UUID",
      "device": "Demo9911",
      "event": "PAUSE",
      "predicted_event": "PAUSE",
      "event_time": "2025-11-08 22:53:10.324",
      "time_in_queue": "8",
      "technician": "System Admin",
      "is_rejected": "0"
    }
  ],
  "total_count": 138,
  "total_pages": 14,
  "current_page": 1,
  "page_size": 10
}
```

### Patient Detail Endpoint
```
GET https://trifetch-backend.onrender.com/api/fetchdata/{patient_id}
```

**Response:**
```json
{
  "success": true,
  "message": "ECG data retrieved successfully",
  "patient_id": "UUID",
  "event_time": "2025-11-08 21:50:16.897",
  "category_predicted": "PAUSE",
  "event_start_second": 25.94,
  "is_rejected": "0",
  "ecg_data": [
    {
      "value1": 1490,
      "value2": 1543
    }
  ]
}
```

## 🎨 Component Details

### Dashboard Component
- **Location**: `src/Dashboard.js`
- **Purpose**: Main landing page displaying patient queue
- **Features**:
  - Fetches paginated patient data
  - Color-codes predictions based on rejection status
  - Handles pagination and row limit changes
  - Navigation to patient detail view

### PatientDetail Component
- **Location**: `src/PatientDetail.js`
- **Purpose**: Detailed view of individual patient ECG data
- **Features**:
  - Displays patient metadata in header
  - Renders two ECG charts (Lead I and Lead II)
  - Shows category and event timing
  - Rejection status indicator

### ECGChart Component
- **Location**: `src/ECGChart.js`
- **Purpose**: Reusable ECG waveform visualization
- **Features**:
  - Displays 6-second window of ECG data
  - Medical-grade grid background
  - Interactive scrollbar with mini-chart
  - Standard calibration (25mm/sec, 10mm/mV)
  - Sampling rate: 200 samples/second

## 🎯 ECG Visualization Standards

The application follows standard medical ECG display specifications:

- **Time Scale**: 25 mm/second (horizontal)
- **Amplitude Scale**: 10 mm/mV (vertical)
- **Grid Pattern**: 
  - Small squares: 1mm × 1mm (light pink)
  - Large squares: 5mm × 5mm (darker pink)
- **Sampling Rate**: 200 samples per second
- **Visible Window**: 6 seconds (1200 samples)
- **Total Recording**: ~90 seconds (18,000 samples)

## 🚦 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

### `npm run eject`
**Note: this is a one-way operation!**

## 🎨 Styling

The application uses custom CSS with a medical-focused color scheme:

- **Primary Color**: #1976d2 (Blue) - Accepted events
- **Error Color**: #dc3545 (Red) - Rejected events
- **Success Color**: #28a745 (Green) - Event timing
- **Background**: #f5f5f5 (Light gray)
- **ECG Grid**: Pink gradient (#fdd, #faa)

## 🔄 Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Main patient queue view |
| `/event_detail` | PatientDetail | Individual patient ECG view |

Navigation uses React Router v7 with state management for passing patient IDs.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### API Connection Issues
- Ensure backend server is running on `https://trifetch-backend.onrender.com`
- Check CORS settings on backend
- Verify API endpoints match the documented structure

### Chart Not Displaying
- Check browser console for errors
- Verify ECG data array is not empty
- Ensure `value1` and `value2` fields exist in response

## 📝 Development Notes

### Adding New Features
1. Update API endpoints if backend changes
2. Maintain ECG medical standards for any chart modifications
3. Follow existing component structure for consistency
4. Update this README with new features

### Code Quality
- Use ESLint for code linting
- Follow React functional component patterns
- Utilize React Hooks for state management
- Keep components modular and reusable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed for Trifetch.

## 👥 Authors

- Craftlo Admin Team

## 🔗 Repository

- **GitHub**: [https://github.com/craftlo-admin/trifetch-frontend](https://github.com/craftlo-admin/trifetch-frontend)
- **Branch**: master

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React and Recharts**
