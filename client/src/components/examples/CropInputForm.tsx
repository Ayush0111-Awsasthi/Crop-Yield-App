import { CropInputForm } from '../crop-input-form'

export default function CropInputFormExample() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
    alert('Form submitted! Check console for data.')
  }

  return (
    <div className="p-6">
      <CropInputForm onSubmit={handleSubmit} />
    </div>
  )
}