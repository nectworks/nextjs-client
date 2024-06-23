'use client';

/*
  File: Users.js
  Description: In this page admins can see all users and
  search for users and review their information.
*/

import { Fragment, useEffect, useState } from 'react';
import AdminDashboardMenu from '../../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import { privateAxios } from '@/config/axiosInstance';
import './ViewUser.css';
import showBottomMessage from '@/Utils/showBottomMessage';
import seperatorIcon from '@/public/Profile/speratorIcon.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import documentLinkIcon from '@/public/Profile/documentLinkIcon.svg';
import linkIcon from '@/public/Profile/otherLinkIcon.svg';
import viewDocumentInNewTab from '@/Utils/viewDocument';
import { DataGrid } from '@mui/x-data-grid';
import Image from 'next/image';

function Users() {
  const router = useRouter();
  const queryParams = new URLSearchParams(location.search);
  const usernameParam = queryParams.get('username');
  const emailParam = queryParams.get('email');

  const [isLoading, setIsLoading] = useState(false);

  /*
    if both email and username are added as parameter in the url, email
    takes precedence over username.
  */

  // state to store typed string by the user.
  const [searchString, setSearchString] = useState(
    emailParam || usernameParam || ''
  );

  // state to store retrieved user information
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isUnRegisteredUser, setIsUnRegisteredUser] = useState(false);

  /* state to store reported users and help submission
     and state required for their pagination */
  // all the reports fetched so far
  const [reportedUsers, setReportedUsers] = useState([]);

  // state to control pagination
  const [reportsPaginationModel, setReportsPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  // state to represent total reports submitted by the particular user
  const [reportsCount, setReportsCount] = useState(-1);
  const [reportPageData, setReportPageData] = useState([]);

  // reference to next page in the data
  const [reportRef, setReportRef] = useState(null);

  const [helpData, setHelpData] = useState([]);
  const [helpPaginationModel, setHelpPaginationModel] = useState({
    pageSize: 2,
    page: 0,
  });

  const [helpSubCount, setHelpSubCount] = useState(-1);
  const [helpPageData, setHelpPageData] = useState([]);
  const [helpRef, setHelpRef] = useState(null);

  // state to store selected help submission to be displayed
  const [viewSelectedHelp, setViewSelectedHelp] = useState(null);

  const [showSection, setShowSection] = useState('profile');

  const [searchMetric, setSearchMetric] = useState(
    emailParam ? 'email' : 'username'
  );

  // function to check if a given string is a valid email
  function validEmail(email) {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // function to search user based on username
  async function searchUser() {
    if (searchString.length === 0) {
      showBottomMessage(`Enter ${searchMetric} to search`);
      return;
    }

    // if admin chose to search by email, check if it is valid
    if (searchMetric === 'email') {
      if (validEmail(searchString) === false) {
        showBottomMessage(`Invalid email`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await privateAxios.get(`/admin/data/users/search`, {
        params: {
          searchMetric: searchMetric,
          searchString: searchString,
        },
      });

      const { user, profile, preferences, unRegisteredUser } = res.data;

      setUser(user);
      setUserProfile(profile);
      setUserPreferences(preferences);
      setIsUnRegisteredUser(unRegisteredUser);
      setIsLoading(false);
    } catch (error) {
      const { message } = error.response.data;
      setIsLoading(false);
      showBottomMessage(message || `Couldn't search user`);
    }
  }

  // function to delete the user
  async function deleteUser() {
    if (isUnRegisteredUser) {
      // TODO: Delete an unregistered user?
      return;
    }

    try {
      await privateAxios.delete(`/admin/users/${user._id}`, {
        params: {
          isUnRegisteredUser: isUnRegisteredUser,
        },
      });

      showBottomMessage(`Delete user ${user.firstName}`);
      setUser(null);
      setUserProfile(null);
      setSearchString('');
    } catch (error) {
      showBottomMessage(`Couldn't delete user`);
    }
  }

  // function to change the data displayed based on the selected section
  function changeSection(e) {
    // remove all the current active options
    const allActiveOptions = document.querySelectorAll('.active_option');
    Array.from(allActiveOptions).forEach((activeOption) => {
      activeOption.classList.remove('active_option');
    });

    // make the clicked option as active.
    e.target.classList.add('active_option');
    const selectedSection = e.target.dataset.section;
    setShowSection(selectedSection);
  }

  // function to get all the reported users
  async function fetchReportedUsers() {
    if (!user) return;
    const selectedUserId = user?._id;

    try {
      const url = `/admin/data/user/reports/${selectedUserId}`;
      const res = await privateAxios.get(url, {
        params: {
          page: reportsPaginationModel.page,
          limit: reportsPaginationModel.pageSize,
          prevDocId: reportRef,
        },
      });

      const { data, next, count } = res.data;

      setReportedUsers((prevData) => [...prevData, ...data]);
      setReportsCount(count);
      setReportRef(next);
    } catch (error) {
      showBottomMessage(`Couldn't get reported users..`);
    }
  }

  // change the data in the current page as page no. and rows no. are changed
  function updateReportsCurrPage() {
    const pageStart =
      reportsPaginationModel.page * reportsPaginationModel.pageSize;
    const pageEnd = pageStart + reportsPaginationModel.pageSize;

    if (
      reportsCount === -1 ||
      (reportedUsers.length - 1 < pageEnd - 1 &&
        reportedUsers.length < reportsCount)
    ) {
      fetchReportedUsers();
    } else {
      setReportPageData(reportedUsers.slice(pageStart, pageEnd));
    }
  }

  // columns for the data grid to display reported users
  const reportedUserCols = [
    {
      field: '_id',
      headerName: 'REPORT ID',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'title',
      headerName: 'TITLE',
      width: 250,
      headerAlign: 'center',
      align: 'center',
      valueGetter: ({ row }) => row?.reportInfo?.title,
    },
    {
      field: 'user',
      headerName: 'REPORTED USER',
      width: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { userId, unRegisteredUserId } = row;
        if (!userId && !unRegisteredUserId) return '-';

        // if the reported user is registered, get their username
        const username = userId !== null ? row.user?.username : null;

        return (
          <>
            {userId !== null ? (
              <Link
                to={`/admin-panel/view-user?username=${username}`}
                target="_blank"
              >
                {username}
              </Link>
            ) : (
              '__' + unRegisteredUserId
            )}
          </>
        );
      },
    },
  ];

  // function to get details of the help submissions by the user
  async function fetchHelpSubmissions() {
    if (!user) return;
    const selectedUserId = user?._id;

    try {
      const url = `/admin/data/user/help/${selectedUserId}`;
      const res = await privateAxios.get(url, {
        params: {
          page: helpPaginationModel.page,
          limit: helpPaginationModel.pageSize,
          prevDocId: helpRef,
        },
      });

      const { data, count, next } = res.data;

      setHelpSubCount(count);
      setHelpRef(next);
      setHelpData((prevData) => [...prevData, ...data]);
    } catch (error) {
      showBottomMessage(`Couldn't get help submissions`);
    }
  }

  // function to update data in the help submissions of the user.
  function updateHelpCurrPage() {
    const pageStart = helpPaginationModel.page * helpPaginationModel.pageSize;
    const pageEnd = pageStart + helpPaginationModel.pageSize;

    if (
      helpSubCount === -1 ||
      (helpData.length - 1 < pageEnd - 1 && helpData.length < helpSubCount)
    ) {
      fetchHelpSubmissions();
    } else {
      setHelpPageData(helpData.slice(pageStart, pageEnd));
    }
  }

  // columns for the data grid of help submission of each user
  const helpSubmissionCols = [
    {
      field: '_id',
      headerName: 'ID',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'heading',
      headerName: 'TITLE',
      width: 300,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'attachment',
      headerName: 'ATTACHMENT',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const attachmentUrl = row.attachment?.url || null;

        if (!attachmentUrl) return '-';

        return (
          <Link to={attachmentUrl} target="_blank">
            <Image src={documentLinkIcon} alt="" />
          </Link>
        );
      },
    },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  async function resolveHelpSubmission() {
    const helpId = viewSelectedHelp._id;

    try {
      const url = '/admin/help/resolve';
      await privateAxios.post(url, { helpId });

      setViewSelectedHelp(null);
      showBottomMessage(`Successfully resolved issue with id '${helpId}'`);

      const updatedData = helpData.map((obj, idx) => {
        if (obj._id === helpId) {
          return { ...obj, status: 'resolved' };
        }
        return obj;
      });
      setHelpData(updatedData);
    } catch (error) {
      showBottomMessage(`Couldn't resolve submission`);
    }
  }

  /* define a small component to view profile image of the searched user
    the already defined one can not be used since it uses UserContext which
    is irrelevant for admin panel.
  */
  function UserProfileImage() {
    if (!user) return;

    const initials = 'AB';

    if (user?.profile) {
      return (
        <Image
          className="profile_image"
          src={user?.profile}
          alt={`${user?.firstName || ''} Nectworks`}
        />
      );
    }

    const style = {
      backgroundColor: '#16A085',
      color: '#FFF',
    };

    return (
      <div data-initials={true} style={style} className="profile_image">
        {initials}
      </div>
    );
  }

  useEffect(() => {
    if (
      (usernameParam && usernameParam.length > 0) ||
      (emailParam && emailParam.length > 0)
    ) {
      searchUser();
    }
  }, [emailParam, searchUser, usernameParam]);

  /* when any section is selected based on the selected option,
    fetch relevant data */
  useEffect(() => {
    if (showSection === 'help_submission' && helpData.length === 0) {
      fetchHelpSubmissions();
      return;
    }

    if (showSection === 'reported_users' && reportedUsers.length === 0) {
      fetchReportedUsers();
      return;
    }
  }, [
    fetchHelpSubmissions,
    fetchReportedUsers,
    helpData.length,
    reportedUsers.length,
    showSection,
  ]);

  useEffect(() => {
    updateReportsCurrPage();
  }, [reportedUsers, reportsPaginationModel, updateReportsCurrPage]);

  useEffect(() => {
    updateHelpCurrPage();
  }, [helpData, helpPaginationModel, updateHelpCurrPage]);

  return (
    <div className="admin_view_user_outer_container">
      <AdminDashboardMenu />

      <div className="admin_view_user_inner_container">
        <h1>User Database</h1>

        {/* search bar */}
        <div className="admin_user_searchbar">
          <label htmlFor="cars">
            Search by:
            <select
              value={searchMetric}
              onChange={(e) => setSearchMetric(e.target.value)}
            >
              <option value="username">Username</option>
              <option value="email">Email</option>
            </select>
          </label>

          <input
            type="text"
            placeholder={`Enter ${searchMetric}`}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />

          <button onClick={searchUser}>Search</button>
        </div>

        {/* container to display user information */}
        <div className="user_display_container">
          {user ? (
            <>
              {/* user information */}
              <div className="user_info">
                <UserProfileImage />

                <div>
                  <span>
                    {(user?.firstName || '') + ' ' + (user?.lastName || '')}
                  </span>
                  {isUnRegisteredUser === true && (
                    <>
                      <br />
                      <span>UnRegistered user</span>
                    </>
                  )}
                  {user?.professionalDetails?.isVerifiedEmail ? (
                    <span className="user_professional_tag">
                      (Professional)
                    </span>
                  ) : null}
                  <br></br>

                  <span className="user_username">{user?.username || ''}</span>
                </div>
              </div>

              {/* data view options */}
              <div className="user_data_options">
                <div
                  data-section="profile"
                  className="view_option active_option"
                  onClick={changeSection}
                >
                  Profile
                </div>
                <div
                  data-section="preferences"
                  className="view_option"
                  onClick={changeSection}
                >
                  Preferences
                </div>
                {/* <div className="view_option">
                  Job posted
                </div> */}
                <div
                  data-section="reported_users"
                  className="view_option"
                  onClick={changeSection}
                >
                  Reported Users
                </div>
                <div
                  data-section="help_submission"
                  className="view_option"
                  onClick={changeSection}
                >
                  Help submission
                </div>
              </div>

              {/* Change data displayed based on the section selected */}

              {/* user profile information */}
              {showSection === 'profile' && (
                <div className="user_profile_info">
                  <div className="profile_info_section">
                    <h4 className="sub_section_heading">About</h4>
                    <p>{userProfile?.about?.bio || ''}</p>
                  </div>

                  <div className="profile_info_section">
                    <h4 className="sub_section_heading">Educuation</h4>

                    <div className="profile_info_education_container">
                      {userProfile?.education.map((education, idx) => {
                        return (
                          <div key={idx}>
                            <h4>{education?.school}</h4>
                            <span className="sub_info">
                              {education?.degree}
                              {education?.fieldOfStudy?.length > 0
                                ? ' in ' + education?.fieldOfStudy
                                : ''}
                            </span>
                            <span>
                              {education?.startYear} -{education?.endYear}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="profile_info_section">
                    <h4 className="sub_section_heading">Experience</h4>

                    <div className="profile_info_education_container">
                      {userProfile?.experience.map((experience, idx) => {
                        return (
                          <div key={idx}>
                            <h4>{experience?.jobTitle}</h4>

                            <span className="sub_info">
                              {experience?.companyName}
                              <Image
                                className="seperatorIcon"
                                src={seperatorIcon}
                                alt=""
                              />
                              {experience?.employmentType}
                            </span>

                            <span>
                              {experience?.startMonth.substring(0, 3) +
                                ' ' +
                                experience?.startYear}{' '}
                              -
                              {experience?.currentlyWorking
                                ? ' Present'
                                : ' ' +
                                  experience?.endMonth.substring(0, 3) +
                                  ' ' +
                                  experience?.endYear}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="profile_info_section">
                    <h4 className="sub_section_heading">Skills</h4>

                    <div className="profile_info_skill_container">
                      {userProfile?.skills.map((skill, idx) => {
                        return (
                          <Fragment key={idx}>
                            <span>{skill}</span>
                            <span className="skill_seperator">
                              {idx !== userProfile?.skills.length - 1
                                ? '-'
                                : ''}
                            </span>
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>

                  <div className="profile_info_section">
                    <h4 className="sub_section_heading">Projects</h4>

                    <div className="profile_info_project_container">
                      {userProfile?.projects.map((project, idx) => {
                        return (
                          <div className="project" key={idx}>
                            <div className="profile_info_document_heading">
                              <h4>{project?.heading}</h4>

                              {project.link?.length > 0 && (
                                <Link to={project?.link} target="_blank">
                                  <Image
                                    src={linkIcon}
                                    alt="achievement link icon"
                                  />
                                </Link>
                              )}

                              {project.document?.key?.length > 0 && (
                                <button
                                  onClick={() => {
                                    viewDocumentInNewTab(project.document.key);
                                  }}
                                >
                                  <Image
                                    src={documentLinkIcon}
                                    alt="achievement document link"
                                  />
                                </button>
                              )}
                            </div>

                            <p>
                              {project?.description
                                .split('\n')
                                .map((sentence, index) => {
                                  return (
                                    <li key={index}>
                                      {sentence} <br></br>
                                    </li>
                                  );
                                })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="profile_info_section">
                    <h4 className="sub_section_heading">Achievements</h4>

                    <div className="profile_info_project_container">
                      {userProfile?.achievements.map((achievement, idx) => {
                        return (
                          <div className="project" key={idx}>
                            <div className="profile_info_document_heading">
                              <h4>{achievement?.heading}</h4>

                              {achievement?.link.length > 0 && (
                                <Link to={achievement?.link} target="_blank">
                                  <Image
                                    src={linkIcon}
                                    alt="achievement link icon"
                                  />
                                </Link>
                              )}

                              {achievement?.document?.key?.length > 0 && (
                                <button
                                  onClick={() => {
                                    viewDocumentInNewTab(
                                      achievement.document.key
                                    );
                                  }}
                                >
                                  <Image
                                    src={documentLinkIcon}
                                    alt="achievement document link"
                                  />
                                </button>
                              )}
                            </div>

                            <p>
                              {achievement?.description
                                .split('\n')
                                .map((sentence, index) => {
                                  return (
                                    <li key={index}>
                                      {sentence} <br></br>
                                    </li>
                                  );
                                })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="profile_info_section">
                    <h4 className="sub_section_heading">Socials</h4>

                    <div className="profile_info_social_container">
                      {userProfile?.socials.map((social, idx) => {
                        return (
                          <Fragment key={idx}>
                            <Link to={social} target="_blank">
                              {social}
                            </Link>
                            <br />
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>

                  <div className="admin_user_delete">
                    <button onClick={deleteUser}>Delete User</button>
                  </div>
                </div>
              )}

              {/* User preferences */}
              {showSection === 'preferences' && (
                <div className="user_preferences">
                  <div className="professional_preferences">
                    <h2>Professional preferences</h2>

                    <p>
                      <span className="field_name">Functional Area : </span>
                      {userPreferences?.professional?.functionalArea || ''}
                    </p>
                    <p>
                      <span className="field_name">Location : </span>
                      {userPreferences?.professional?.locations.map(
                        (location, idx) => {
                          return (
                            <Fragment key={idx}>
                              <span className="preference_value">
                                {location}
                              </span>
                              {idx <=
                              userPreferences?.professiona?.locations.length -
                                1 ? (
                                <span className="preference_seperator">-</span>
                              ) : null}
                            </Fragment>
                          );
                        }
                      )}
                    </p>
                    <p>
                      <span className="field_name">Experience :</span>
                      {userPreferences?.professional?.experience || ''}
                    </p>
                    <p>
                      <span className="field_name">Skills : </span>
                      {userPreferences?.professional?.skills.map(
                        (skill, idx) => {
                          return (
                            <Fragment key={idx}>
                              <span className="preference_value">{skill}</span>
                              {idx <
                              userPreferences?.professional?.skills.length -
                                1 ? (
                                <span className="preference_seperator">-</span>
                              ) : null}
                            </Fragment>
                          );
                        }
                      )}
                    </p>
                  </div>

                  <div className="seeker_preferences">
                    <h2>Seeker preferences</h2>

                    <p>
                      <span className="field_name">Functional Area : </span>
                      {userPreferences?.seeker?.functionalArea || ''}
                    </p>
                    <p>
                      <span className="field_name">Location : </span>
                      {userPreferences?.seeker?.locations.map(
                        (location, idx) => {
                          return (
                            <Fragment key={idx}>
                              <span className="preference_value">
                                {location}
                              </span>
                              {idx <
                              userPreferences?.seeker?.locations.length - 1 ? (
                                <span className="preference_seperator">-</span>
                              ) : null}
                            </Fragment>
                          );
                        }
                      )}
                    </p>
                    <p>
                      <span className="field_name">Experience : </span>
                      {userPreferences?.seeker?.experience || ''}
                    </p>

                    <p>
                      <span className="field_name">Skills : </span>
                      {userPreferences?.seeker?.skills.map((skill, idx) => {
                        return (
                          <Fragment key={idx}>
                            <span className="preference_value">{skill}</span>
                            {idx <
                            userPreferences?.seeker?.skills.length - 1 ? (
                              <span className="preference_seperator">-</span>
                            ) : null}
                          </Fragment>
                        );
                      })}
                    </p>

                    <p>
                      <span className="field_name">Companies : </span>
                      {userPreferences?.seeker?.companies.map(
                        (company, idx) => {
                          return (
                            <Fragment key={idx}>
                              <span className="preference_value">
                                {company}
                              </span>
                              {idx <
                              userPreferences?.seeker?.companies.length - 1 ? (
                                <span className="preference_seperator">-</span>
                              ) : null}
                            </Fragment>
                          );
                        }
                      )}
                    </p>

                    <p>
                      <span className="field_name">Work Type : </span>
                      {userPreferences?.seeker?.workType || ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Reported Users */}
              {showSection === 'reported_users' && (
                <div className="reported_users_container">
                  <div className="reported_users_data_grid">
                    <DataGrid
                      getRowId={(row) => row._id}
                      rows={reportPageData}
                      columns={reportedUserCols}
                      rowCount={reportsCount}
                      paginationMode="server"
                      paginationModel={reportsPaginationModel}
                      onPaginationModelChange={setReportsPaginationModel}
                      pageSizeOptions={[5, 10, 15, 20]}
                      sx={{
                        '& .MuiDataGrid-root': {
                          borderRadius: '8px',
                          boxShadow: '1px 1px 4px 0px rgba(0, 0, 0, 0.25)',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: '#EBEBEB',
                          color: 'black',
                        },
                        '& .MuiDataGrid-cell': {
                          backgroundColor: '#FFF',
                          color: 'black',
                        },
                        '& .MuiDataGrid-row': {
                          margin: '3px 0',
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Contact Us requests */}
              {showSection === 'help_submission' && (
                <div className="user_help_submissions">
                  {viewSelectedHelp !== null && (
                    <div className="view_selected_help_submission">
                      <p>
                        <span>Heading : </span>
                        {viewSelectedHelp.heading || ''}
                      </p>

                      <p>
                        <span>Description : </span>
                        {viewSelectedHelp.description || ''}
                      </p>

                      <p>
                        <span>Date : </span>
                        {viewSelectedHelp.date}
                      </p>

                      <p>
                        <span>Status : </span>
                        {viewSelectedHelp.status}
                      </p>

                      <button onClick={resolveHelpSubmission}>Resolve</button>
                    </div>
                  )}

                  <div className="user_help_data_grid">
                    <DataGrid
                      getRowId={(row) => row._id}
                      rows={helpPageData}
                      columns={helpSubmissionCols}
                      onRowClick={({ row }) => setViewSelectedHelp(row)}
                      rowCount={helpSubCount}
                      paginationMode="server"
                      paginationModel={helpPaginationModel}
                      onPaginationModelChange={setHelpPaginationModel}
                      pageSizeOptions={[2, 10, 15, 20]}
                      sx={{
                        '& .MuiDataGrid-root': {
                          borderRadius: '8px',
                          boxShadow: '1px 1px 4px 0px rgba(0, 0, 0, 0.25)',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: '#EBEBEB',
                          color: 'black',
                        },
                        '& .MuiDataGrid-cell': {
                          backgroundColor: '#FFF',
                          color: 'black',
                        },
                        '& .MuiDataGrid-row': {
                          margin: '3px 0',
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Users;
