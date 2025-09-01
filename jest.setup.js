import '@testing-library/jest-dom'

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: 'CategoryScale',
  LinearScale: 'LinearScale',
  PointElement: 'PointElement',
  LineElement: 'LineElement',
  Title: 'Title',
  Tooltip: 'Tooltip',
  Legend: 'Legend',
  ArcElement: 'ArcElement',
  RadialLinearScale: 'RadialLinearScale',
  Filler: 'Filler',
}))

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>,
  Radar: () => <div data-testid="radar-chart">Radar Chart</div>,
}))

// Mock window.alert
global.alert = jest.fn()

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock HTMLElement.click
HTMLElement.prototype.click = jest.fn()