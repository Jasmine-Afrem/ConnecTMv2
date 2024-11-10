import CreateGigForm from './CreateGigForm';

const ParentComponent = () => {
  // This is the onSubmit function you need to pass to CreateGigForm
  const handleCreateGig = async (gigData: GigData) => {
    try {
      // Perform your submission logic, like sending the gig data to an API
      console.log('Gig Data:', gigData);
      await fetch('/api/create-gig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gigData),
      });
      console.log('Gig created successfully!');
    } catch (error) {
      console.error('Error creating gig:', error);
    }
  };

  // Categories for the modal
  const categories = ['Music', 'Art', 'Food', 'Technology'];

  return (
    <CreateGigForm 
      onSubmit={handleCreateGig} // Pass the onSubmit function here
      categories={categories} // Pass categories as well
    />
  );
};

export default ParentComponent;
