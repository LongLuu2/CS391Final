import styled from 'styled-components';

const StyledForm = styled.form`
  width: 100%;
  position: absolute;
  bottom: 0;
`;

const StyledInput = styled.input`
  width: 100%;
  font-size: 18px;
  padding: 15px 10px 15px 40px;
  outline: 1px solid lightgray;
  border: 1px solid lightgray;
  background: url('https://neal.fun/infinite-craft/search.svg') no-repeat 10px center white;
  background-size: 22px;
`

const SearchBar = ({ searchTerm, handleFormChange, onSubmit }) => {

    const handleSubmit = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
        }
    };

    return (
        <StyledForm>
            <label>
                <StyledInput
                    type="text"
                    name="name"
                    placeholder="Search Items"
                    value={searchTerm}
                    onKeyDown={handleSubmit}
                    onChange={handleFormChange}
                />
            </label>
        </StyledForm>
    );
};

export default SearchBar;