import ActiveProfile from './ActiveProfile'

class JobSeekerProfile extends ActiveProfile {
    static fromServer(data) {
        return new JobSeekerProfile({
            ...data,
        })
    }
}

export default JobSeekerProfile