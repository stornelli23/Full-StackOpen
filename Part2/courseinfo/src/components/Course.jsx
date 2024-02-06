const Course = ({course}) => {

    const Header = ({course}) => {
        return(
            <div>
            <h2>{course.name}</h2>
          </div>
        )
      }
            
    const Content = ({parts}) => {
        // console.log(parts)
        return (
            <div>
                {parts.map(part => <Part key={part.id} part={part}/>)}
          </div>
        )
    }
    
    const Part = ({part}) => {
        return (
            <div>
            <p>
              {part.name} {part.exercises}
            </p>
          </div>
        );
    };

    const Total = ({parts}) => {
        const total = parts.reduce((acc, current)=> acc + current.exercises, 0);
        return (
          <div>
            <h3>Total of {total} exercises</h3>
          </div>
        )
      }

      return (
        <>
          <Header course={course}/>
          <Content parts={course.parts}/>
          <Total parts={course.parts}/>
        </>
      )

}

export default Course
