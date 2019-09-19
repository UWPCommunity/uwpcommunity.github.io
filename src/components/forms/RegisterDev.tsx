import { Text, Stack, PrimaryButton, TextField, DefaultButton } from "office-ui-fabric-react";
import React from "react";
import { backendHost } from "../../common/const";
import { GetCurrentUser, IDiscordUser, discordAuthEndpoint } from "../../common/services/discord";
import { isLocalhost } from "../../common/helpers";

interface IUserSubmission {
    name?: string;
    email?: string;
    discordId?: string;
};

export interface IRegisterDevProps {
    onCancel?: Function;
};

export const RegisterDevForm = (props: IRegisterDevProps) => {
    let [userRequest, setUserRequest] = React.useState<IUserSubmission>();
    let [submissionStatus, setSubmissionStatus] = React.useState<string>("");

    /* Todo: Attempt to find an existing user in the DB and set this according, then prepopulate the fields below */
    let [modifying, setModifying] = React.useState(false);

    async function addUser() {
        let user: IDiscordUser | undefined = await GetCurrentUser();
        if (!user) {
            window.location.href = discordAuthEndpoint;
            return;
        };

        let url = `https://${backendHost}/user?accessToken=${user.id}`;
        if (isLocalhost) {
            url = `http://${backendHost}/user?accessToken=admin`;
        }

        if (userRequest) {
            userRequest.discordId = user.id;
        }

        let request = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            method: modifying ? "PUT" : "POST",
            body: JSON.stringify(userRequest)
        });

        let json = await request.json();
        setSubmissionStatus(json);
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px" }}>
                <TextField label="Developer name:"
                    description="Friendly name that users will see"
                    styles={{ root: { width: "100%" } }}
                    required
                    onChange={(e: any, value: any) => setUserRequest({ ...userRequest, name: value })} />

                <TextField label="Contact email:"
                    description="Optional"
                    styles={{ root: { width: "100%" } }}
                    onChange={(e: any, value: any) => setUserRequest({ ...userRequest, email: value })} />

                {/* <TextField label="Discord Id:"
                    styles={{ root: { width: "100%" } }}
                    onChange={(e: any, value: any) => setUserRequest({ ...userRequest, discordId: value })}
                /> */}

                <Text style={{ color: "red" }}>{submissionStatus}</Text>
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <PrimaryButton text="Register"
                        onClick={addUser} />
                    {
                        props.onCancel ?
                            <DefaultButton text="Cancel" onClick={() => props.onCancel ? props.onCancel() : undefined} />
                            : ""
                    }
                </Stack>
            </Stack>
        </Stack>
    )
};